package torclms.repository;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;
import torclms.model.UserAssignment;

import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@DataJpaTest
public class UserAssignmentRepositoryTest {

    @Autowired
    TestEntityManager entityManager;

    @Autowired
    UserAssignmentRepository userAssignmentRepository;

    @Test
    public void whenIdentifyingExpiredAssignment_correctAssignmentIdentified () {
        List<UserAssignment> assignmentList = userAssignmentRepository.findExpiredAssignments();

        assertEquals(1, assignmentList.size());
    }
}
